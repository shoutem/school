Pod::Spec.new do |s|

  s.name         = "ShoutemShopify"
  s.version      = "1.0"
  s.summary      = "A Shopify extension for Shoutem."

  s.description  = "The Shopify extension enables store owners to make money by selling
                    products in Shoutem applications."

  s.homepage     = "http://www.shoutem.com"
  s.platform     = :ios

  s.license      = { :type => "MIT" }

  s.author       = { "Mihovil Kovačević" => "mihovil.kovacevic@shoutem.com" }

  s.source       = { :path => "" }

  s.exclude_files = "Classes/Exclude"

  # s.public_header_files = "Classes/**/*.h"

  s.dependency  'Mobile-Buy-SDK', '2.2.0'

end
